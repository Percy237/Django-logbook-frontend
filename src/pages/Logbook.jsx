import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import * as api from "../api";

const Logbook = () => {
  const { course_id } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery(
    ["logbookEntries", course_id],
    () => api.getLogbookEntries(course_id)
  );

  const { data: authUser } = useQuery(
    "authenticatedUser",
    api.getAuthenticatedUserDetails
  );

  const isDelegate =
    authUser && authUser.length > 0 ? authUser[0]["is_delegate"] : null;

  console.log(isDelegate);

  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const mutation = useMutation(api.createLogbookEntry, {
    onSuccess: () => {
      queryClient.invalidateQueries(["logbookEntries", course_id]);
      handleCloseModal();
    },
  });

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    reset();
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("start_time", data.start_time);
    formData.append("end_time", data.end_time);
    formData.append("text", data.text);
    Array.from(data.uploaded_files).forEach((file) => {
      formData.append("uploaded_files", file);
    });

    mutation.mutate({ course_id, formData });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading logbook entries</div>;

  return (
    <div>
      <h1>Logbook entries for course {data[0]?.course_name}</h1>

      {data.length > 0 ? (
        data.map((entry) => (
          <div key={entry.id}>
            <h2>{entry.text}</h2>
            <p>Start time: {entry.start_time}</p>
            <p>End time: {entry.end_time}</p>
            <p>Created at: {new Date(entry.created_at).toLocaleString()}</p>
            <div>
              <h3>Files:</h3>
              <ul>
                {entry.files.map((file) => (
                  <li key={file.id}>
                    <a
                      href={file.file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.file}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <h1>No entries</h1>
      )}

      {isDelegate ? (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleOpenModal}
        >
          Fill Logbook
        </button>
      ) : null}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">New Logbook Entry</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-gray-700">Start Time</label>
                <input
                  type="time"
                  {...register("start_time", { required: true })}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">End Time</label>
                <input
                  type="time"
                  {...register("end_time", { required: true })}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Text</label>
                <textarea
                  {...register("text", { required: true })}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Upload Files</label>
                <input
                  type="file"
                  {...register("uploaded_files")}
                  multiple
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logbook;
