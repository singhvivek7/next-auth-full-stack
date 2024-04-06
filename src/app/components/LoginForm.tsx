'use client';

import { ChangeEvent, useState } from 'react';
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
  CardHeader,
} from '@nextui-org/react';
import { loginSchema, signUpSchema } from '@/lib/validation';

const initialLogin = {
  email: '',
  password: '',
};
const initialSignUp = {
  name: '',
  email: '',
  password: '',
};
const initialError = {
  name: '',
  email: '',
  password: '',
};

export const LoginForm = () => {
  const [selected, setSelected] = useState('login');
  const [loginData, setLoginData] = useState(initialLogin);
  const [signUpData, setSignUpData] = useState(initialSignUp);
  const [error, setError] = useState(initialError);

  const handleLogin = async () => {
    setError(initialError);
    const validatedFields = loginSchema.safeParse(loginData);

    if (!validatedFields.success) {
      setError(prev => ({
        ...prev,
        email: validatedFields.error.flatten().fieldErrors.email?.[0] || '',
        password:
          validatedFields.error.flatten().fieldErrors.password?.[0] || '',
      }));
    }
  };

  const handleSignUp = async () => {
    setError(initialError);
    const validatedFields = signUpSchema.safeParse(signUpData);

    if (!validatedFields.success) {
      setError(prev => ({
        ...prev,
        name: validatedFields.error.flatten().fieldErrors.name?.[0] || '',
        email: validatedFields.error.flatten().fieldErrors.email?.[0] || '',
        password:
          validatedFields.error.flatten().fieldErrors.password?.[0] || '',
      }));
    }
  };

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError(prev => ({ ...prev, [name]: '' }));
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUpChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError(prev => ({ ...prev, [name]: '' }));
    setSignUpData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="max-w-full w-[340px] h-[500px]">
      <CardBody className="overflow-hidden">
        <Tabs
          fullWidth
          size="md"
          aria-label="Tabs form"
          selectedKey={selected}
          onSelectionChange={key => setSelected(key as string)}>
          <Tab key="login" title="Login">
            <form className="flex flex-col gap-4" noValidate>
              <Input
                className={
                  error.email ? 'border-red-500 border rounded-medium' : ''
                }
                label="Email"
                placeholder="Enter your email"
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
              />
              <p className="text-red-500 pt-0 mt-0">{error.email}</p>
              <Input
                className={
                  error.password ? 'border-red-500 border rounded-medium' : ''
                }
                label="Password"
                placeholder="Enter your password"
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
              />
              <p className="text-red-500 pt-0 mt-0">{error.password}</p>
              <p className="text-center text-small">
                Need to create an account?{' '}
                <Link
                  size="sm"
                  onPress={() => setSelected('sign-up')}
                  className="cursor-pointer">
                  Sign up
                </Link>
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  fullWidth
                  color="primary"
                  type="button"
                  onClick={handleLogin}>
                  Login
                </Button>
              </div>
            </form>
          </Tab>
          <Tab key="sign-up" title="Sign up">
            <form className="flex flex-col gap-4">
              <Input
                className={
                  error.name ? 'border-red-500 border rounded-medium' : ''
                }
                label="Name"
                placeholder="Enter your name"
                type="text"
                name="name"
                value={signUpData.name}
                onChange={handleSignUpChange}
              />
              <p className="text-red-500 pt-0 mt-0">{error.name}</p>
              <Input
                className={
                  error.email ? 'border-red-500 border rounded-medium' : ''
                }
                label="Email"
                placeholder="Enter your email"
                type="email"
                name="email"
                value={signUpData.email}
                onChange={handleSignUpChange}
              />
              <p className="text-red-500 pt-0 mt-0">{error.email}</p>
              <Input
                className={
                  error.password ? 'border-red-500 border rounded-medium' : ''
                }
                label="Password"
                placeholder="Enter your password"
                type="password"
                name="password"
                value={signUpData.password}
                onChange={handleSignUpChange}
              />
              <p className="text-red-500 pt-0 mt-0">{error.password}</p>
              <p className="text-center text-small">
                Already have an account?{' '}
                <Link
                  size="sm"
                  onPress={() => setSelected('login')}
                  className="cursor-pointer">
                  Login
                </Link>
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  fullWidth
                  color="primary"
                  type="button"
                  onClick={handleSignUp}>
                  Sign up
                </Button>
              </div>
            </form>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
};
