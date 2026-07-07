"use client";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import MotionWrapper from "@/components/custom-ui/MotionWrapper";
import ProfileForm from "@/features/profile/components/ProfileForm";

const Profile = () => {
  return (
    <ProtectedRoute>
      <MotionWrapper>
        <ProfileForm />
      </MotionWrapper>
    </ProtectedRoute>
  );
};

export default Profile;
