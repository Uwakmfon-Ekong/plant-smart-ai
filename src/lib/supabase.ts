import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          farm_name: string | null
          location: string | null
          phone: string | null
          role: 'farmer' | 'expert' | 'researcher' | 'admin'
          avatar_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      crops: {
        Row: {
          id: string
          user_id: string
          name: string
          variety: string | null
          field_name: string
          planted_date: string | null
          expected_harvest: string | null
          status: 'healthy' | 'monitor' | 'alert'
          health_score: number
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['crops']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['crops']['Insert']>
      }
      scans: {
        Row: {
          id: string
          user_id: string
          crop_id: string | null
          image_url: string
          diagnosis: string | null
          disease_name: string | null
          confidence: number | null
          treatment: string | null
          chemical_recommendation: string | null
          severity: 'low' | 'medium' | 'high' | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['scans']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['scans']['Insert']>
      }
      marketplace_listings: {
        Row: {
          id: string
          seller_id: string
          title: string
          description: string
          category: 'seedling' | 'input' | 'produce'
          price: number
          currency: string
          quantity: number
          unit: string
          location: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['marketplace_listings']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['marketplace_listings']['Insert']>
      }
      experts: {
        Row: {
          id: string
          user_id: string
          specialty: string
          bio: string | null
          hourly_rate: number
          rating: number
          sessions_count: number
          is_available: boolean
          created_at: string
        }
      }
      community_posts: {
        Row: {
          id: string
          author_id: string
          title: string
          content: string
          tags: string[]
          likes_count: number
          replies_count: number
          created_at: string
        }
      }
    }
  }
}
