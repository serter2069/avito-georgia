// Extend Express Request to carry decoded JWT payload globally
// This allows req.user in any route without custom AuthRequest interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

export {};
