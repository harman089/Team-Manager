import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import {
  useRegisterMutation,
  useUpdateUserMutation,
} from "../redux/slices/userApiSlice";
import { toast } from "sonner";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { isValidEmail } from "../utils/validation";

const AddUser = ({ open, setOpen, userData, refetch }) => {
  let defaultValues = userData ?? {};
  const { user } = useSelector((state) => state.auth);

  const [register, { isLoading }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const password = watch("password");

  const handleOnSubmit = async (data) => {
    try {
      // Validate email
      if (!isValidEmail(data.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      if (userData) {
        // Update existing user
        const res = await updateUser({
          ...data,
          _id: userData._id,
        }).unwrap();
        toast.success(res.message || "Profile updated successfully");
      } else {
        // Add new user
        if (!data.password || data.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }

        const res = await register({
          ...data,
          isAdmin: false,
        }).unwrap();
        toast.success(res.message || "New User Added Successfully");
      }
      if (refetch) refetch();
      setTimeout(() => setOpen(false), 300);
    } catch (err) {
      console.log(err);
      const errorMessage = err?.data?.message || err?.data?.errors?.[0] || err.error || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const isSubmitting = isLoading || isUpdating;

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Full name'
              type='text'
              name='name'
              label='Full Name'
              className='w-full rounded'
              register={formRegister("name", {
                required: "Full name is required!",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder='Title'
              type='text'
              name='title'
              label='Title'
              className='w-full rounded'
              register={formRegister("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />
            <Textbox
              placeholder='Email Address'
              type='email'
              name='email'
              label='Email Address'
              className='w-full rounded'
              register={formRegister("email", {
                required: "Email Address is required!",
                validate: (value) =>
                  isValidEmail(value) || "Please enter a valid email",
              })}
              error={errors.email ? errors.email.message : ""}
            />

            <Textbox
              placeholder='Role'
              type='text'
              name='role'
              label='Role'
              className='w-full rounded'
              register={formRegister("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
            />

            {!userData && (
              <>
                <Textbox
                  placeholder='Password'
                  type='password'
                  name='password'
                  label='Password'
                  className='w-full rounded'
                  register={formRegister("password", {
                    required: "Password is required!",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  error={errors.password ? errors.password.message : ""}
                />
                <PasswordStrengthIndicator password={password} />
              </>
            )}
          </div>

          {isSubmitting ? (
            <div className='py-5'>
              <Loading />
            </div>
          ) : (
            <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
              <Button
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
                label='Submit'
              />

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;
