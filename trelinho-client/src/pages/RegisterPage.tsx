import { useState } from 'react';
import type { FormEvent } from 'react';
import { register, type AuthUser } from '../services/auth-api';

type RegisterPageProps = {
  onNavigateLogin: () => void;
  onAuthenticated: (token: string, user: AuthUser) => void;
};

export function RegisterPage({ onNavigateLogin, onAuthenticated }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await register({ name, email, password });
      onAuthenticated(result.accessToken, result.user);
    } catch (submissionError) {
      setError((submissionError as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Cadastrar</h1>
      <form onSubmit={onSubmit} className="auth-form">
        <label>
          Nome
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>

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
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <p>
        Já tem conta?{' '}
        <button type="button" className="link-button" onClick={onNavigateLogin}>
          Entrar
        </button>
      </p>
    </section>
  );
}
