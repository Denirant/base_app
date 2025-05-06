import { useForm } from 'react-hook-form';
import { useState, ReactNode } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useRequestPasswordResetMutation } from 'librechat-data-provider/react-query';
import type { TRequestPasswordReset, TRequestPasswordResetResponse } from 'librechat-data-provider';
import type { FC } from 'react';
import type { TLoginLayoutContext } from '~/common';
import { useLocalize } from '~/hooks';
import { ArrowLeft } from 'lucide-react';

const BodyTextWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div
      className="text-center relative mt-2 rounded-3xl border border-blue-500/20 bg-green-50/50 px-6 py-4 text-blue-700 shadow-sm transition-all dark:bg-blue-950/20 dark:text-gray-50"
      role="alert"
    >
      {children}
    </div>
  );
};

const ResetPasswordBodyText = () => {
  const localize = useLocalize();
  return (
    <div className="flex flex-col space-y-4">
      <p>{localize('com_auth_reset_password_if_email_exists')}</p>
      <a
        className="inline-flex text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        href="/login"
      >
        {localize('com_auth_back_to_login')}
      </a>
    </div>
  );
};

function RequestPasswordReset() {
  const localize = useLocalize();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRequestPasswordReset>();
  const [bodyText, setBodyText] = useState<ReactNode | undefined>(undefined);
  const { startupConfig, setHeaderText } = useOutletContext<TLoginLayoutContext>();

  const requestPasswordReset = useRequestPasswordResetMutation();

  const onSubmit = (data: TRequestPasswordReset) => {
    requestPasswordReset.mutate(data, {
      onSuccess: (data: TRequestPasswordResetResponse) => {
        if (data.link && !startupConfig?.emailEnabled) {
          setHeaderText('com_auth_reset_password');
          setBodyText(
            <span>
              {localize('com_auth_click')}{' '}
              <a className="text-blue-500 hover:underline" href={data.link}>
                {localize('com_auth_here')}
              </a>{' '}
              {localize('com_auth_to_reset_your_password')}
            </span>,
          );
        } else {
          setHeaderText('com_auth_reset_password_link_sent');
          setBodyText(<ResetPasswordBodyText />);
        }
      },
      onError: () => {
        setHeaderText('com_auth_reset_password_link_sent');
        setBodyText(<ResetPasswordBodyText />);
      },
    });
  };

  if (bodyText) {
    return <BodyTextWrapper>{bodyText}</BodyTextWrapper>;
  }

  return (
    <form
      className="mt-8 space-y-6"
      aria-label="Password reset form"
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className='mb-4 text-center text-3xl font-semibold text-gray-900 dark:text-gray-100'>Сброс пароля</h1>
      <div className="space-y-2">
        <div className="relative">
          <input
            type="email"
            id="email"
            autoComplete="off"
            aria-label={localize('com_auth_email')}
            {...register('email', {
              required: localize('com_auth_email_required'),
              minLength: {
                value: 3,
                message: localize('com_auth_email_min_length'),
              },
              maxLength: {
                value: 120,
                message: localize('com_auth_email_max_length'),
              },
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: localize('com_auth_email_pattern'),
              },
            })}
            aria-invalid={!!errors.email}
            className="webkit-dark-styles transition-color peer w-full rounded-2xl border border-border-light bg-surface-primary px-3.5 pb-2.5 pt-3 text-text-primary duration-200 focus:border-blue-400 focus:outline-none"
            placeholder=""
          />
          <label
            htmlFor="email"
            className="absolute start-3 top-1.5 z-10 origin-[0] -translate-y-4 scale-75 transform bg-surface-primary px-2 text-sm text-text-secondary-alt duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1.5 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-400 dark:peer-focus:text-blue-400 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            {localize('com_auth_email_address')}
          </label>
        </div>
        {errors.email && (
          <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="mt-3 w-full flex items-center gap-3">
        <a
          href="/login"
          className="block text-center w-fit px-4 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 duration-200 transition-all rounded-2xl h-full text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <ArrowLeft/>
        </a>
        <button
          type="submit"
          disabled={!!errors.email}
          className="w-full rounded-2xl bg-gray-800 px-4 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-600 dark:bg-gray-50 dark:text-gray-700 dark:hover:bg-gray-200/90 dark:hover:text-gray-900"
        >
          {localize('com_auth_continue')}
        </button>
      </div>
    </form>
  );
}

export default RequestPasswordReset;
