import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import * as api from "../api";

const Logbook = () => {
  const { course_id } = useParams();
  const queryClient = useQueryClient();

  // Fetch data using react-query
  const { data, isLoading, error } = useQuery(
    ["logbookEntries", course_id],
    () => api.getLogbookEntries(course_id)
  );

  const { data: authUser } = useQuery(
    "authenticatedUser",
    api.getAuthenticatedUserDetails
  );

  const { data: teachers } = useQuery("teachers", api.getTeachers);

  const { data: teacherHours } = useQuery(["teachersHours", course_id], () =>
    api.getTeacherCourseHours(course_id)
  );

  console.log(teacherHours);

  // Check if the user is a delegate
  const isDelegate =
    authUser && authUser.length > 0 ? authUser[0]["is_delegate"] : null;

  // Modal states
  const [showLogbookModal, setShowLogbookModal] = useState(false);
  const [showHoursModal, setShowHoursModal] = useState(false);

  // Form handling
  const { register, handleSubmit, reset } = useForm();

  const logbookMutation = useMutation(api.createLogbookEntry, {
    onSuccess: () => {
      queryClient.invalidateQueries(["logbookEntries", course_id]);
      queryClient.invalidateQueries(["teachersHours", course_id]);
      handleCloseLogbookModal();
    },
  });

  const hoursMutation = useMutation(api.createTeacherCourseHours, {
    onSuccess: () => {
      queryClient.invalidateQueries(["teachersHours", course_id]);
      handleCloseHoursModal();
    },
  });

  // Modal handlers
  const handleOpenLogbookModal = () => setShowLogbookModal(true);
  const handleCloseLogbookModal = () => {
    setShowLogbookModal(false);
    reset();
  };

  const handleOpenHoursModal = () => setShowHoursModal(true);
  const handleCloseHoursModal = () => {
    setShowHoursModal(false);
    reset();
  };

  // Submit handlers
  const onSubmitLogbook = (data) => {
    const formData = new FormData();
    formData.append("start_time", data.start_time);
    formData.append("end_time", data.end_time);
    formData.append("text", data.text);
    formData.append("teacher", data.teacher);
    Array.from(data.uploaded_files).forEach((file) => {
      formData.append("uploaded_files", file);
    });

    logbookMutation.mutate({ course_id, formData });
  };

  const onSubmitHours = (data) => {
    hoursMutation.mutate({ course_id, data });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading logbook entries</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 relative">
      <h1 className="text-3xl font-bold mb-8">
        Logbook Entries for Course {data[0]?.course_name}
      </h1>

      {data.length > 0 ? (
        data
          .slice()
          .reverse()
          .map((entry) => (
            <div
              key={entry.id}
              className="bg-white shadow-md rounded-md p-6 mb-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{entry.text}</h2>
              </div>
              <p className="text-gray-600 mb-2">
                Start time: {entry.start_time}
              </p>
              <p className="text-gray-600 mb-2">End time: {entry.end_time}</p>
              <p className="text-gray-600 mb-2">
                Created at: {new Date(entry.created_at).toLocaleString()}
              </p>
              <div>
                <h3 className="text-lg font-semibold mb-2">Files:</h3>
                <ul className="list-disc pl-6">
                  {entry.files.map((file) => (
                    <li key={file.id}>
                      <a
                        href={file.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline truncate overflow-hidden"
                        title={file.file} // Tooltip with full file name
                      >
                        {file.file}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleEdit(entry.id)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(entry.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
      ) : (
        <h1 className="text-2xl font-semibold text-gray-700">No entries</h1>
      )}
      {isDelegate && (
        <div className=" flex fixed bottom-16 right-0">
          <button
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-black transition duration-300"
            onClick={handleOpenLogbookModal}
          >
            Fill Logbook
          </button>
          <button
            className="mt-4 ml-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-black transition duration-300"
            onClick={handleOpenHoursModal}
          >
            Update Course Hours
          </button>
        </div>
      )}

      {showLogbookModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">New Logbook Entry</h2>
            <form onSubmit={handleSubmit(onSubmitLogbook)}>
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
                <label className="block text-gray-700">Teacher</label>
                <select
                  id="teacher"
                  name="teacher"
                  className="mt-1 p-2 border rounded w-full"
                  {...register("teacher", {
                    required: "This field is required",
                  })}
                >
                  <option value="">Select Teacher</option>
                  {teachers?.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
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
                  className="mr-4 px-4 py-2 bg-gray-900 text-white rounded"
                  onClick={handleCloseLogbookModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHoursModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Hours Taught</h2>
              <div>
                {teacherHours?.map((teacher) => (
                  <div key={teacher.id} className="mb-4">
                    <p className="text-gray-700">
                      Name: {teacher.teacher_name}
                    </p>
                    <p className="text-gray-700">
                      Hours: {teacher.hours_taught}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmitHours)}>
              <div className="mb-4">
                <label htmlFor="teacher" className="block text-gray-700">
                  Teacher
                </label>
                <select
                  id="teacher"
                  name="teacher"
                  {...register("teacher", {
                    required: "This field is required",
                  })}
                  className="mt-1 p-2 border rounded w-full"
                >
                  <option value="">Select Teacher</option>
                  {teacherHours?.map((teacher) => (
                    <option key={teacher.id} value={teacher.teacher}>
                      {teacher.teacher_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="hours_taught" className="block text-gray-700">
                  Hours Taught
                </label>
                <input
                  type="number"
                  id="hours_taught"
                  {...register("hours_taught", { required: true })}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseHoursModal}
                  className="mr-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
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
