import repository from "@/data/repositories";
import { IOAuth2Command, OAuth2UseCase } from "@/use-cases/OAuth2UseCase";
import { Profile } from "passport";
import { VerifyCallback } from "passport-google-oauth20";

export const oauth2Callback = async (profile: Profile, done: VerifyCallback) => {
  const oauth2UseCase = new OAuth2UseCase(repository);
  try {
    const id = profile.id;
    const displayName = profile.displayName;
    const email = profile.emails?.[0]?.value || null;
    const imageUrl = profile.photos?.[0]?.value || null;
    const providerName = profile.provider;

    const command: IOAuth2Command = {
      providerName,
      id,
      displayName,
      email,
      imageUrl,
    };

    const user = await oauth2UseCase.execute(command);

    return done(null, user);
  } catch (error) {
    const err = error as Error;
    return done(null, false, { message: err.message });
  }
};
