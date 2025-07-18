import { User } from "@/data/entities/User";
import repository from "@/data/repositories";
import { SigninUseCase } from "@/use-cases/SigninUseCase";
import { plainToInstance } from "class-transformer";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

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
