import { User } from '../models';
import { hashPassword, comparePassword, generateToken } from '../utils/helpers';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
  token: string;
}

export class AuthService {
  /**
   * Registers a new user.
   */
  public static async register(input: RegisterInput): Promise<AuthResponse> {
    const { name, email, password } = input;

    if (!name || !email || !password) {
      const error: any = new Error('Name, email, and password are required.');
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      const error: any = new Error('A user with this email address already exists.');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'user',
    });

    const userData = user.get({ plain: true });

    const token = generateToken({
      id: userData.id,
      email: userData.email,
      role: userData.role,
    });

    return {
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
      token,
    };
  }

  /**
   * Authenticates user credentials and returns JWT token.
   */
  public static async login(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;

    if (!email || !password) {
      const error: any = new Error('Email and password are required.');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      const error: any = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const userData = user.get({ plain: true });

    const isMatch = await comparePassword(password, userData.password);
    if (!isMatch) {
      const error: any = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({
      id: userData.id,
      email: userData.email,
      role: userData.role,
    });

    return {
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
      token,
    };
  }

  /**
   * Retrieves profile of current user.
   */
  public static async getMe(userId: string) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      const error: any = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }
}

export default AuthService;
