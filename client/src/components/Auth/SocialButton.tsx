import React from 'react';

const SocialButton = ({ id, enabled, serverDomain, oauthPath, Icon, label }) => {
  if (!enabled) {
    return null;
  }

  return (
    <div className="mt-2 flex gap-x-2 w-full opacity-80 hover:opacity-100 transition-all duration-200">
      <a
        aria-label={`${label}`}
        className="flex w-full items-center justify-center dark:bg-gray-850 bg-gray-100 space-x-3 rounded-2xl border dark:border-gray-800 border-gray-200 px-5 py-3 text-text-primary transition-colors duration-200"
        href={`${serverDomain}/oauth/${oauthPath}`}
        data-testid={id}
      >
        <Icon />
      </a>
    </div>
  );
};

export default SocialButton;
