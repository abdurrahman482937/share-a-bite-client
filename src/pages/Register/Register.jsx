
import { useContext, useRef, useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import AuthContext from "../../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

const Register = () => {
  const [eye, setEye] = useState(false);
  const emailRef = useRef(null);

  const { createUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: "",
      photourl: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const onSubmit = async (data) => {
    if (!data.email || !data.password) {
      toast.error("Please provide email and password");
      return;
    }

    try {
      const result = await createUser(data.email, data.password);
      updateProfile(result.user, {
        displayName: data.name || undefined,
        photoURL: data.photourl || undefined,
      }).catch((err) => console.log("updateProfile error", err));

      toast.success("Register successful!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(error?.message || "Register failed. Please try again.");
    }
  };

  return (
    <div className="hero min-h-screen">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl dark:bg-gray-50 dark:text-gray-800">
        <h1 className="text-2xl font-bold text-center">Register</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          aria-busy={loading || isSubmitting}
        >
          <div className="text-sm">
            <label htmlFor="name" className="block dark:text-gray-600">
              Name
            </label>
            <input
              id="name"
              {...register("name", {
                maxLength: { value: 80, message: "Name is too long" },
              })}
              type="text"
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-green-600 border"
              disabled={loading || isSubmitting}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="text-sm">
            <label htmlFor="photourl" className="block dark:text-gray-600">
              Photo URL
            </label>
            <input
              id="photourl"
              {...register("photourl", {
                pattern: {
                  value:
                    /^(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/i,
                  message: "Enter a valid URL",
                },
              })}
              type="url"
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-3 rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-green-600 border"
              disabled={loading || isSubmitting}
            />
            {errors.photourl && (
              <p className="text-xs text-red-500 mt-1">{errors.photourl.message}</p>
            )}
          </div>

          <div className="text-sm">
            <label htmlFor="email" className="block dark:text-gray-600">
              Email
            </label>
            <input
              ref={emailRef}
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Provide a valid email",
                },
              })}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={`w-full px-4 py-3 rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-green-600 border ${errors.email ? "border-red-500" : ""
                }`}
              disabled={loading || isSubmitting}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="text-sm">
            <label htmlFor="password" className="block dark:text-gray-600">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password at least 6 characters" },
                  validate: (value) => {
                    const hasUpper = /[A-Z]/.test(value);
                    const hasLower = /[a-z]/.test(value);
                    if (!hasUpper || !hasLower) {
                      return "Must have uppercase and lowercase letters";
                    }
                    return true;
                  },
                })}
                type={eye ? "text" : "password"}
                placeholder="Password"
                autoComplete="new-password"
                className={`w-full px-4 py-3 rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-green-600 border ${errors.password ? "border-red-500" : ""
                  }`}
                disabled={loading || isSubmitting}
              />
              <button
                type="button"
                aria-label={eye ? "Hide password" : "Show password"}
                className="text-2xl absolute top-2 right-7 cursor-pointer z-10"
                onClick={() => setEye(!eye)}
                title={eye ? "Hide password" : "Show password"}
              >
                {eye ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="block w-full p-3 text-center rounded-sm dark:text-gray-50 dark:bg-green-600"
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-xs text-center sm:px-6 dark:text-gray-600">
          you have an account?{" "}
          <Link to="/login" className="underline dark:text-gray-800">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
