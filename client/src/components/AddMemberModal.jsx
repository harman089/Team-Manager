import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Loading from "./Loader";
import Button from "./Button";
import { useAddProjectMemberMutation } from "../redux/slices/projectApiSlice";
import { useGetTeamListQuery } from "../redux/slices/userApiSlice";
import { toast } from "sonner";
import { MdOutlineClose } from "react-icons/md";

const AddMemberModal = ({ open, setOpen, projectId, refetch, projectMembers }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [addMember, { isLoading }] = useAddProjectMemberMutation();
  const { data: teamList, isLoading: isLoadingTeam } = useGetTeamListQuery();

  const handleSelectMember = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleAddMembers = async () => {
    try {
      if (selectedMembers.length === 0) {
        toast.error("Please select at least one member");
        return;
      }

      for (const memberId of selectedMembers) {
        await addMember({
          id: projectId,
          memberId,
        }).unwrap();
      }

      toast.success("Members added successfully");
      setSelectedMembers([]);
      if (refetch) refetch();
      setTimeout(() => setOpen(false), 300);
    } catch (err) {
      console.log(err);
      const errorMessage =
        err?.data?.message || err?.data?.errors?.[0] || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const availableMembers = teamList?.filter(
    (member) =>
      !projectMembers?.some((m) => m._id === member._id) &&
      !selectedMembers.includes(member._id)
  ) || [];

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <Dialog.Title
        as='h2'
        className='text-base font-bold leading-6 text-gray-900 mb-4'
      >
        ADD TEAM MEMBERS
      </Dialog.Title>

      <div className='mt-4 flex flex-col gap-4 max-h-96 overflow-y-auto'>
        {isLoadingTeam ? (
          <Loading />
        ) : availableMembers.length > 0 ? (
          availableMembers.map((member) => (
            <label key={member._id} className='flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50'>
              <input
                type='checkbox'
                checked={selectedMembers.includes(member._id)}
                onChange={() => handleSelectMember(member._id)}
                className='w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
              />
              <div className='flex-1'>
                <p className='font-semibold text-gray-900'>{member.name}</p>
                <p className='text-sm text-gray-600'>{member.email}</p>
              </div>
            </label>
          ))
        ) : (
          <p className='text-center text-gray-600 py-4'>
            All team members are already in this project
          </p>
        )}
      </div>

      <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
        <Button
          disabled={isLoading || selectedMembers.length === 0}
          type='button'
          className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto'
          label={isLoading ? "Adding..." : "Add Members"}
          onClick={handleAddMembers}
        />

        <Button
          type='button'
          className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
          onClick={() => {
            setSelectedMembers([]);
            setOpen(false);
          }}
          label='Cancel'
        />
      </div>
    </ModalWrapper>
  );
};

export default AddMemberModal;
