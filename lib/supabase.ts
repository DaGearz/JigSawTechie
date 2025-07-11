import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role key (bypasses RLS)
// Fallback to regular client if service key is not available
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;

// Types for our database
export interface Quote {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  project_type: string;
  budget: string;
  timeline: string;
  description: string;
  features: string[];
  status:
    | "new"
    | "reviewing"
    | "quoted"
    | "accepted"
    | "declined"
    | "completed";
  created_at: string;
  updated_at: string;
}

// Database functions
export const quoteService = {
  // Create a new quote
  async createQuote(
    quoteData: Omit<Quote, "id" | "created_at" | "updated_at" | "status">
  ) {
    console.log("🚀 Creating quote with data:", quoteData);

    const { data, error } = await supabase
      .from("quotes")
      .insert([
        {
          ...quoteData,
          status: "new",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Error creating quote:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }

    console.log("✅ Quote created successfully:", data);
    return data;
  },

  // Get all quotes (for admin)
  async getAllQuotes() {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching quotes:", error);
      throw error;
    }

    return data;
  },

  // Update quote status
  async updateQuoteStatus(id: string, status: Quote["status"]) {
    const { data, error } = await supabase
      .from("quotes")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating quote:", error);
      throw error;
    }

    return data;
  },

  // Get quote by ID
  async getQuoteById(id: string) {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching quote:", error);
      throw error;
    }

    return data;
  },
};
