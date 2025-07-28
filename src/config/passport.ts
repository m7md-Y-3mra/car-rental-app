import { User } from "@/data/entities/User";
import repository from "@/data/repositories";
import { IOAuth2Command, OAuth2UseCase } from "@/use-cases/OAuth2UseCase";
import { SigninUseCase } from "@/use-cases/SigninUseCase";
import { plainToInstance } from "class-transformer";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./env";

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const signinUseCase = new SigninUseCase(repository);

      try {
        const user = await signinUseCase.execute({ email, password });

        return done(null, user);
      } catch (error: unknown) {
        done(error);
      }
    },
  ),
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const oauth2UseCase = new OAuth2UseCase(repository);
      try {
        const id = profile.id;
        const displayName = profile.displayName;
        const email = profile.emails?.[0]?.value || null;
        const imageUrl = profile.photos?.[0]?.value || null;

        const command: IOAuth2Command = {
          providerName: "google",
          id,
          displayName,
          email,
          imageUrl,
        };

        const user = await oauth2UseCase.execute(command);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user: UserDTO, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const userData = await repository.findUserById(id);
    if (!userData) {
      return done(null, false);
    }
    const user = plainToInstance(User, userData);
    done(null, user.asDto());
  } catch (error) {
    done(error);
  }
});

export default passport;
