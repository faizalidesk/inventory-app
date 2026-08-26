import { supabase } from "../lib/supabase";

/**
 * Upload an image file to Supabase Storage or convert to Data URL fallback
 */
export async function uploadImage(file, bucket = "project-covers") {
  if (!file) return null;
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: "3600", upsert: true });

    if (error) {
      console.warn("Supabase storage upload failed, converting to Base64 data URL:", error.message);
      return await fileToBase64(file);
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || (await fileToBase64(file));
  } catch (err) {
    console.warn("Storage exception, converting to Base64:", err);
    return await fileToBase64(file);
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Fetch all items from a given Supabase table (projects, experiments, notes, bookmarks)
 * Optional platformId filter for multi-platform support (Alpha, Beta, Gamma, Delta)
 */
export async function fetchCollection(type, userId = null, platformId = null) {
  if (type === "projects") {
    try {
      const { data: settingData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "projects_data")
        .maybeSingle();

      if (settingData && settingData.value) {
        const parsed = typeof settingData.value === "string" ? JSON.parse(settingData.value) : settingData.value;
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error fetching projects from site_settings:", e);
    }
  }

  let query = supabase
    .from(type)
    .select("*");

  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (platformId) {
    query = query.eq("platform_id", platformId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error(`Error fetching ${type} from Supabase:`, error);
    return [];
  }
  return data || [];
}

/**
 * Fetch total record breakdown per tenant/platform from Supabase
 */
export async function fetchTenantMetrics() {
  try {
    const [projects, experiments, notes, bookmarks] = await Promise.all([
      supabase.from("projects").select("id, platform_id"),
      supabase.from("experiments").select("id, platform_id"),
      supabase.from("notes").select("id, platform_id"),
      supabase.from("bookmarks").select("id"),
    ]);

    const metrics = {};

    const countByPlatform = (res, tableKey) => {
      if (res.error || !res.data) return;
      res.data.forEach(item => {
        const pId = (item.platform_id || "alpha").toLowerCase();
        if (!metrics[pId]) {
          metrics[pId] = { projects: 0, experiments: 0, notes: 0, total: 0 };
        }
        metrics[pId][tableKey] = (metrics[pId][tableKey] || 0) + 1;
        metrics[pId].total = (metrics[pId].total || 0) + 1;
      });
    };

    countByPlatform(projects, "projects");
    countByPlatform(experiments, "experiments");
    countByPlatform(notes, "notes");

    return metrics;
  } catch (err) {
    console.error("Error fetching tenant metrics:", err);
    return {};
  }
}


/**
 * Subscribe to real-time changes on a given collection table
 */
export function subscribeToCollection(type, callback, platformId = null) {
  const channelName = `realtime_${type}_${platformId || "all"}_${Date.now()}`;
  const channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: type },
      (payload) => {
        if (platformId && payload.new && payload.new.platform_id && payload.new.platform_id !== platformId) {
          return;
        }
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Fetch a single item by its slug from Supabase
 */
export async function fetchItemBySlug(type, slug) {
  const { data, error } = await supabase
    .from(type)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching ${type} item with slug '${slug}':`, error);
    return null;
  }
  return data;
}

/**
 * Create a new item in a Supabase table
 */
export async function createItem(type, item, userId, platformId = null) {
  const payload = {
    ...item,
    ...(userId ? { user_id: userId } : {}),
    ...(platformId ? { platform_id: platformId } : {}),
  };

  const { data, error } = await supabase
    .from(type)
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error(`Error creating ${type} in Supabase:`, error);
    throw error;
  }
  return data;
}

/**
 * Update an item by ID in a Supabase table
 */
export async function updateItem(type, id, payload) {
  const { data, error } = await supabase
    .from(type)
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating ${type} in Supabase:`, error);
    throw error;
  }
  return data;
}

/**
 * Delete an item by ID (or field/value) from Supabase
 */
export async function deleteItem(type, field, value) {
  const { error } = await supabase
    .from(type)
    .delete()
    .eq(field, value);

  if (error) {
    console.error(`Error deleting from ${type}:`, error);
    throw error;
  }
  return true;
}

/**
 * Fetch profile for a user
 */
export async function fetchProfile(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile from Supabase:", error);
    return null;
  }
  return data;
}

/**
 * Upsert profile for a user
 */
export async function updateProfile(userId, profileData) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...profileData, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) {
    console.error("Error updating profile in Supabase:", error);
    throw error;
  }
  return data;
}

const sanitizeMaintData = (val) => {
  if (!val) return val;
  let obj = typeof val === "string" ? JSON.parse(val) : val;
  if (!obj || typeof obj !== "object") return val;

  let title = obj.title || "System Under Maintenance";
  let message = obj.message || "We are performing system upgrades and performance enhancements. Please check back shortly.";

  const indonesianKeywords = ["situs", "pemeliharaan", "kami", "sedang", "melakukan", "peningkatan", "pembaruan", "beberapa", "saat", "kembali"];
  if (indonesianKeywords.some(kw => String(title).toLowerCase().includes(kw))) {
    title = "System Under Maintenance";
  }
  if (indonesianKeywords.some(kw => String(message).toLowerCase().includes(kw))) {
    message = "We are performing system upgrades and performance enhancements. Please check back shortly.";
  }

  return { ...obj, title, message };
};

/**
 * Fetch Maintenance & Countdown settings for public site
 */
export async function fetchMaintenanceSettings() {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", "maintenance")
      .maybeSingle();

    if (data?.value) {
      const val = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
      return sanitizeMaintData(val);
    }
  } catch (err) {
    console.error("Error fetching maintenance settings:", err);
  }

  const localData = localStorage.getItem("desktopalie_maintenance_settings");
  if (localData) {
    try {
      return sanitizeMaintData(JSON.parse(localData));
    } catch (e) {}
  }
  return null;
}

/**
 * Fetch Landing Page content settings
 */
export async function fetchLandingPageSettings() {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", "landing_page")
      .maybeSingle();

    if (data?.value) {
      const val = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
      return val;
    }
  } catch (err) {
    console.error("Error fetching landing page settings:", err);
  }

  const localData = localStorage.getItem("desktopalie_landing_settings");
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch (e) {}
  }
  return null;
}

/**
 * Fetch News articles from Supabase (table "news" or site_settings key "news_articles" with fallback to newsData)
 */
export async function fetchNewsArticles() {
  // 1. Try "news" table
  try {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      localStorage.setItem("desktopalie_news_articles", JSON.stringify(data));
      return data;
    }
  } catch (e) {}

  // 2. Try "site_settings" key "news_articles"
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", "news_articles")
      .maybeSingle();

    if (!error && data?.value) {
      const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
      if (Array.isArray(parsed) && parsed.length > 0) {
        localStorage.setItem("desktopalie_news_articles", JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch (e) {}

  // 3. Fallback to localStorage
  const local = localStorage.getItem("desktopalie_news_articles");
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }

  // 4. Default fallback to bundled newsData
  try {
    const { NEWS_ARTICLES } = await import("../data/newsData");
    return NEWS_ARTICLES || [];
  } catch (e) {
    return [];
  }
}

/**
 * Fetch a single news article by ID or slug
 */
export async function fetchNewsArticleById(idOrSlug) {
  const articles = await fetchNewsArticles();
  return articles.find(a => a.id === idOrSlug || a.slug === idOrSlug) || null;
}
