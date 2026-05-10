import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../redux/slices/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "sonner";
import Loading from "../components/Loader";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";
import { validateRegisterForm } from "../utils/validation";

const Register = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const password = watch("password");

  const submitHandler = async (data) => {
    try {
      // Validate form on client side
      const validation = validateRegisterForm(data);
      if (!validation.isValid) {
        toast.error(Object.values(validation.errors)[0]);
        return;
      }

      const res = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        title: data.title,
        role: data.role,
        isAdmin: false,
      }).unwrap();

      toast.success("Registration successful! Please log in.");
      navigate("/log-in");
    } catch (err) {
      const errorMessage = err?.data?.message || err?.data?.errors?.[0] || err.error || "Registration failed";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user]);

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        {/* left side */}
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600'>
              Join our task management platform!
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700'>
              <span>Create Account</span>
              <span>Get Started</span>
            </p>

            <div className='cell'>
              <div className='circle rotate-in-up-left'></div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-6 bg-white px-10 pt-10 pb-10'
          >
            <div className=''>
              <p className='text-blue-600 text-3xl font-bold text-center'>
                Create Account
              </p>
              <p className='text-center text-sm text-gray-700 mt-2'>
                Join us to manage your tasks efficiently
              </p>
            </div>

            <div className='flex flex-col gap-y-4'>
              <Textbox
                placeholder='John Doe'
                type='text'
                name='name'
                label='Full Name'
                className='w-full rounded-full'
                register={register("name", {
                  required: "Full name is required!",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                error={errors.name ? errors.name.message : ""}
              />

              <Textbox
                placeholder='email@example.com'
                type='email'
                name='email'
                label='Email Address'
                className='w-full rounded-full'
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />

              <Textbox
                placeholder='Your Title'
                type='text'
                name='title'
                label='Title'
                className='w-full rounded-full'
                register={register("title", {
                  required: "Title is required!",
                })}
                error={errors.title ? errors.title.message : ""}
              />

              <Textbox
                placeholder='Your Role'
                type='text'
                name='role'
                label='Role'
                className='w-full rounded-full'
                register={register("role", {
                  required: "Role is required!",
                })}
                error={errors.role ? errors.role.message : ""}
              />

              <Textbox
                placeholder='Create a strong password'
                type='password'
                name='password'
                label='Password'
                className='w-full rounded-full'
                register={register("password", {
                  required: "Password is required!",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.password ? errors.password.message : ""}
              />
              <PasswordStrengthIndicator password={password} />

              <Textbox
                placeholder='Confirm your password'
                type='password'
                name='cpassword'
                label='Confirm Password'
                className='w-full rounded-full'
                register={register("cpassword", {
                  required: "Please confirm your password!",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                error={errors.cpassword ? errors.cpassword.message : ""}
              />

              {isLoading ? (
                <Loading />
              ) : (
                <Button
                  type='submit'
                  label='Create Account'
                  className='w-full h-10 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition'
                />
              )}

              <div className='text-center mt-4'>
                <p className='text-sm text-gray-600'>
                  Already have an account?{" "}
                  <Link
                    to='/login'
                    className='text-blue-600 hover:text-blue-700 hover:underline font-semibold'
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
