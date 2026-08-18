const SUPABASE_URL = "https://yeziskdgrhwtupeyriuj.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_uvXbe8cBHvTbWRyABX6u_g_AlReebm4";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);