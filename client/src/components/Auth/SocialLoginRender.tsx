import { GoogleIcon, FacebookIcon, OpenIDIcon, GithubIcon, DiscordIcon, AppleIcon, YandexIcon, VKIcon } from '~/components';

import SocialButton from './SocialButton';

import { useLocalize } from '~/hooks';

import { TStartupConfig } from 'librechat-data-provider';

function SocialLoginRender({
  startupConfig,
}: {
  startupConfig: TStartupConfig | null | undefined;
}) {
  const localize = useLocalize();

  if (!startupConfig) {
    return null;
  }

  const providerComponents = {
    discord: startupConfig.discordLoginEnabled && (
      <SocialButton
        key="discord"
        enabled={startupConfig.discordLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="discord"
        Icon={DiscordIcon}
        label={localize('com_auth_discord_login')}
        id="discord"
      />
    ),
    facebook: startupConfig.facebookLoginEnabled && (
      <SocialButton
        key="facebook"
        enabled={startupConfig.facebookLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="facebook"
        Icon={FacebookIcon}
        label={localize('com_auth_facebook_login')}
        id="facebook"
      />
    ),
    github: startupConfig.githubLoginEnabled && (
      <SocialButton
        key="github"
        enabled={startupConfig.githubLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="github"
        Icon={GithubIcon}
        label={localize('com_auth_github_login')}
        id="github"
      />
    ),
    google: startupConfig.googleLoginEnabled && (
      <SocialButton
        key="google"
        enabled={startupConfig.googleLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="google"
        Icon={GoogleIcon}
        label={'Google'}
        id="google"
      />
    ),
    apple: startupConfig.appleLoginEnabled && (
      <SocialButton
        key="apple"
        enabled={startupConfig.appleLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="apple"
        Icon={AppleIcon}
        label={localize('com_auth_apple_login')}
        id="apple"
      />
    ),
    openid: startupConfig.openidLoginEnabled && (
      <SocialButton
        key="openid"
        enabled={startupConfig.openidLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="openid"
        Icon={() =>
          startupConfig.openidImageUrl ? (
            <img src={startupConfig.openidImageUrl} alt="OpenID Logo" className="h-5 w-5" />
          ) : (
            <OpenIDIcon />
          )
        }
        label={startupConfig.openidLabel}
        id="openid"
      />
    ),
    yandex: (
      <SocialButton
        key="yandex"
        enabled={true}
        serverDomain={startupConfig.serverDomain}
        oauthPath="google"
        Icon={YandexIcon}
        label={'Yandex'}
        id="yandex"
      />
    ),
    vk: (
      <SocialButton
        key="vk"
        enabled={true}
        serverDomain={startupConfig.serverDomain}
        oauthPath="google"
        Icon={VKIcon}
        label={'VK'}
        id="vk"
      />
    ),
  };

  return (
    startupConfig.socialLoginEnabled && (
      <>
        {startupConfig.emailLoginEnabled && (
          <>
            <div className="relative mt-6 flex mx-auto w-4/5 items-center justify-center border-[1px] border-t border-gray-200 uppercase dark:border-gray-800">
              <div className="absolute bg-gray-50 px-3 text-xs text-black dark:bg-gray-900 dark:text-white">
                Or
              </div>
            </div>
            <div className="mt-8" />
          </>
        )}
        <div className="mt-2 flex gap-3 mx-auto w-3/4">
          {/* Отображаем стандартные кнопки из конфигурации */}
          {startupConfig.socialLogins?.map((provider) => providerComponents[provider] || null)}
          
          {/* Добавляем кнопки VK и Yandex принудительно */}
          {providerComponents.vk}
          {providerComponents.yandex}
        </div>
      </>
    )
  );
}

export default SocialLoginRender;