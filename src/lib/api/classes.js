const baseUrl =process.env.NEXT_PUBLIC_BASE_URL;
export const getTrainerClasses = async (trainerId, status='Pending') => {
    const res = await fetch(`${baseUrl}/api/classes?trainerId=${trainerId}&status=${status}`);
    return res.json();
};