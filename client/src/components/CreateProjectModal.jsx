import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { useCreateProjectMutation } from "../redux/slices/projectApiSlice";
import { toast } from "sonner";

const CreateProjectModal = ({ open, setOpen, refetch }) => {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleOnSubmit = async (data) => {
    try {
      if (!data.name || !data.name.trim()) {
        toast.error("Project name is required");
        return;
      }

      const res = await createProject({
        name: data.name,
        description: data.description || "",
      }).unwrap();

      toast.success(res.message || "Project created successfully");
      reset();
      if (refetch) refetch();
      setTimeout(() => setOpen(false), 300);
    } catch (err) {
      console.log(err);
      const errorMessage =
        err?.data?.message || err?.data?.errors?.[0] || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Dialog.Title
          as='h2'
          className='text-base font-bold leading-6 text-gray-900 mb-4'
        >
          CREATE NEW PROJECT
        </Dialog.Title>
        <div className='mt-2 flex flex-col gap-6'>
          <Textbox
            placeholder='Project name'
            type='text'
            name='name'
            label='Project Name'
            className='w-full rounded'
            register={register("name", {
              required: "Project name is required!",
              minLength: {
                value: 3,
                message: "Project name must be at least 3 characters",
              },
            })}
            error={errors.name ? errors.name.message : ""}
          />
          <div>
            <label className='text-sm font-semibold text-gray-600 mb-2 block'>
              Description
            </label>
            <textarea
              placeholder='Project description (optional)'
              {...register("description")}
              rows='4'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
            />
          </div>
        </div>

        {isLoading ? (
          <div className='py-5'>
            <Loading />
          </div>
        ) : (
          <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
            <Button
              type='submit'
              className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto'
              label='Create'
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
  );
};

export default CreateProjectModal;
