import { useState } from 'react';
import type { FormEvent } from 'react';
import { login, type AuthUser } from '../services/auth-api';

type LoginPageProps = {
  onNavigateRegister: () => void;
  onAuthenticated: (token: string, user: AuthUser) => void;
};

export function LoginPage({ onNavigateRegister, onAuthenticated }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login({ email, password });
      onAuthenticated(result.accessToken, result.user);
    } catch (submissionError) {
      setError((submissionError as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Entrar</h1>
      <form onSubmit={onSubmit} className="auth-form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p>
        Não tem conta?{' '}
        <button type="button" className="link-button" onClick={onNavigateRegister}>
          Cadastre-se
        </button>
      </p>
    </section>
  );
}
