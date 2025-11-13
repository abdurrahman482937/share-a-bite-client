import { useContext, useRef, useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import AuthContext from "../../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

const Login = () => {
  const emailRef = useRef(null);
  const [eye, setEye] = useState(false);

  const { loading, signInWithGoogle, signInEmail } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const googleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        console.log(result.user);
        toast.success("Google login successful!");
        navigate(from);
      })
      .catch((error) => {
        console.log("Error during Google sign-in:", error);
        toast.error("Google login failed. Please try again.");
      });
  };

  const onSubmit = async (data) => {
    try {
      await signInEmail(data.email, data.password);
      toast.success("Login successful!");
      navigate(from);
    } catch (error) {
      console.error("Error during email/password sign-in:", error);
      toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="hero min-h-[80vh]">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl dark:bg-gray-50 dark:text-gray-800">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          aria-busy={loading || isSubmitting}
        >
          {/* Email */}
          <div className="space-y-1 text-sm">
            <label htmlFor="email" className="block dark:text-gray-600">
              Email
            </label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading || isSubmitting}
              className={`w-full px-4 py-3 rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-green-600 border ${errors.email ? "border-red-500" : ""
                }`}
              {...register("email", {
                required: "Email required!",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Vlid email address den",
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1 text-sm">
            <label htmlFor="password" className="block dark:text-gray-600">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={eye ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                disabled={loading || isSubmitting}
                className={`w-full px-4 py-3 rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-green-600 border ${errors.password ? "border-red-500" : ""
                  }`}
                {...register("password", {
                  required: "Password required!",
                  minLength: {
                    value: 6,
                    message: "Password at least 6 characters",
                  },
                  validate: (value) => {
                    const hasUpper = /[A-Z]/.test(value);
                    const hasLower = /[a-z]/.test(value);
                    if (!hasUpper || !hasLower) {
                      return "Must have uppercase and lowercase letters";
                    }
                    return true;
                  },
                })}
              />
              <button
                type="button"
                aria-label={eye ? "Hide password" : "Show password"}
                className="text-2xl absolute top-2 right-7 cursor-pointer z-10"
                onClick={() => setEye(!eye)}
                title={eye ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {eye ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}

            <div className="flex justify-end text-xs dark:text-gray-600">
              <Link to="/forgot-password">
                <button
                  type="button"
                  className="underline cursor-pointer"
                  disabled={loading || isSubmitting}
                >
                  Forgot Password?
                </button>
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="block w-full p-3 text-center rounded-sm dark:text-gray-50 dark:bg-green-600"
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? "Login..." : "Login"}
          </button>
        </form>

        <div className="flex items-center pt-4 space-x-1">
          <div className="flex-1 h-px sm:w-16 dark:bg-gray-300"></div>
          <p className="px-3 text-sm dark:text-gray-600">Login with social accounts</p>
          <div className="flex-1 h-px sm:w-16 dark:bg-gray-300"></div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            type="button"
            aria-label="Log in with Google"
            title="Sign in with Google"
            className="p-3 rounded-sm"
            onClick={googleSignIn}
            disabled={loading || isSubmitting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
              <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
            </svg>
          </button>
        </div>

        <p className="text-xs text-center sm:px-6 dark:text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="underline dark:text-gray-800">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
