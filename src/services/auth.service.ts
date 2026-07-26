import userRepository from '../repositories/user.repository';
import { createSupabaseServerClient } from '../lib/supabase/server';
import { ConflictError, AuthError } from '../lib/errors';
import notificationService from './notification.service';
import { User, Profile } from '@prisma/client';

export class AuthService {
  async register(
    email: string,
    password: string,
    fullName: string
  ): Promise<{ user: User; profile: Profile }> {
    const supabase = await createSupabaseServerClient();

    // 1. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError || !authData.user) {
      throw new ConflictError(authError?.message || 'Failed to sign up user in Supabase.');
    }

    // 2. Create user & profile records in PostgreSQL inside a single Prisma transaction using the Supabase UUID
    const { user, profile } = await userRepository.create({
      id: authData.user.id,
      email,
      fullName,
    });

    // 3. Send system welcome notification
    await notificationService.createNotification({
      userId: user.id,
      type: 'Welcome',
      title: 'Welcome to CareerOS!',
      message: `Hello ${fullName}, welcome to CareerOS. Start tracking your applications by uploading your first resume!`,
    });

    return { user, profile };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User }> {
    const supabase = await createSupabaseServerClient();

    // 1. Sign in via Supabase Auth (this automatically sets session cookies)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      throw new AuthError(authError?.message || 'Invalid email or password.');
    }

    // 2. Ensure user exists in our local PostgreSQL database (Self-healing on-demand sync)
    let user = await userRepository.findById(authData.user.id);
    if (!user) {
      const fullName = authData.user.user_metadata?.full_name || email.split('@')[0] || 'User';
      const created = await userRepository.create({
        id: authData.user.id,
        email: authData.user.email!,
        fullName,
      });
      user = created.user;
    }

    return { user };
  }

  async changePassword(newPassword: string): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      throw new AuthError(error.message);
    }
  }
}

export default new AuthService();
