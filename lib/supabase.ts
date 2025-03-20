import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);
export type UserSession = {
  user: {
    id: string;
    email: string;
    fullname ?: string;
    password ?: string;
    number ?: string
  } | null;
  error: Error | null;
};

export type Booking = {
  id: string;
  user_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
};

export type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
};

  
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession(): Promise<UserSession | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching session:', error);
      return null;
    }
    return {
      user: session?.user ? { id: session.user.id, email: session.user.email ?? '' } : null,
      error: null,
    };
  }

export async function createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'status'>) {
    console.log(booking)
  const { data, error } = await supabase
    .from('bookings')
    .insert([booking])
    .select()
    .single();
  console.log(booking)
  if (error) throw error;
  return data;
}

export async function createContact(contact: Omit<Contact, 'id' | 'created_at' | 'status'>) {
    console.log('Creating contact:', contact);
    const { data, error } = await supabase
      .from('contacts')
      .insert([contact])
      .select()
      .single();
  
    if (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
    console.log('Contact created:', data);
    return data;
  }

export async function getUserBookings(userId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}