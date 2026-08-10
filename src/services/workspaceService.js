import { supabase } from "../lib/supabase";

/**
 * Fetch all items from a given Supabase table (projects, experiments, notes, bookmarks)
 */
export async function fetchCollection(type) {
  const { data, error } = await supabase
    .from(type)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error fetching ${type} from Supabase:`, error);
    return [];
  }
  return data || [];
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
export async function createItem(type, item, userId) {
  const payload = {
    ...item,
    ...(userId ? { user_id: userId } : {}),
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
      return val;
    }
  } catch (err) {
    console.error("Error fetching maintenance settings:", err);
  }

  const localData = localStorage.getItem("desktopalie_maintenance_settings");
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch (e) {}
  }
  return null;
}
