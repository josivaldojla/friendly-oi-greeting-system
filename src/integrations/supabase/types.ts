export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      completed_services: {
        Row: {
          completion_date: string
          created_at: string
          id: string
          mechanic_id: string | null
          received_amount: number
          service_ids: string[]
          total_amount: number
        }
        Insert: {
          completion_date?: string
          created_at?: string
          id?: string
          mechanic_id?: string | null
          received_amount: number
          service_ids: string[]
          total_amount: number
        }
        Update: {
          completion_date?: string
          created_at?: string
          id?: string
          mechanic_id?: string | null
          received_amount?: number
          service_ids?: string[]
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "completed_services_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "mechanics"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      mechanics: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string | null
          specialization: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          specialization?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          specialization?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      motorcycle_models: {
        Row: {
          brand: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      service_history: {
        Row: {
          created_at: string
          id: string
          mechanic_id: string | null
          received_amount: number
          service_data: Json
          title: string
          total_amount: number
        }
        Insert: {
          created_at?: string
          id?: string
          mechanic_id?: string | null
          received_amount?: number
          service_data: Json
          title: string
          total_amount?: number
        }
        Update: {
          created_at?: string
          id?: string
          mechanic_id?: string | null
          received_amount?: number
          service_data?: Json
          title?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_history_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "mechanics"
            referencedColumns: ["id"]
          },
        ]
      }
      service_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          notes: string | null
          photo_url: string
          sequence_number: number
          service_record_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          photo_url: string
          sequence_number: number
          service_record_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          photo_url?: string
          sequence_number?: number
          service_record_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_photos_service_record_id_fkey"
            columns: ["service_record_id"]
            isOneToOne: false
            referencedRelation: "service_records"
            referencedColumns: ["id"]
          },
        ]
      }
      service_records: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          mechanic_id: string | null
          motorcycle_model_id: string | null
          notes: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          mechanic_id?: string | null
          motorcycle_model_id?: string | null
          notes?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          mechanic_id?: string | null
          motorcycle_model_id?: string | null
          notes?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_records_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_records_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "mechanics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_records_motorcycle_model_id_fkey"
            columns: ["motorcycle_model_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_models"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_customer: {
        Args: {
          p_name: string
          p_phone: string
          p_email: string
          p_address: string
        }
        Returns: string
      }
      create_customers_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_customer: {
        Args: { p_id: string }
        Returns: undefined
      }
      update_customer: {
        Args: {
          p_id: string
          p_name: string
          p_phone: string
          p_email: string
          p_address: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
