"use client";

import { useEffect, useState } from "react";
import { useSession } from "./SessionProvider";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import { collection, doc } from "firebase/firestore";
import { db } from "@/firebase";
import Cookies from "js-cookie";
import { AXIOS } from "@/axios";
import { FREE_LIMIT, PRO_LIMIT } from "@/lib/tierLimits";

function useSubscription() {
	const { user } = useSession();
	console.log("user_useSubscription", user);

	const [hasActiveMembership, setHasActiveMembership] = useState(
		user?.activeMembership
	);
	const [isOverFileLimit, setIsOverFileLimit] = useState(false);
	const [loading, setLoading] = useState(true);
	const [filesLoading, setFilesLoading] = useState(true);
	const [error, setError] = useState(null);

	// const [snapshot, loading, error] = useDocument(
	// 	user && doc(db, "users", user.userId),
	// 	{
	// 		snapshotListenOptions: {
	// 			includeMetadataChanges: true,
	// 		},
	// 	}
	// );

	// const [filesSnapshot, filesLoading] = useCollection(
	// 	user && collection(db, "users", user.userId, "files")
	// );

	// useEffect(() => {
	// 	if (!snapshot) return;

	// 	const data = snapshot.data();
	// 	if (!data) return;

	// 	setHasActiveMembership(data.activeMembership);
	// }, [snapshot]);

	// useEffect(() => {
	// 	if (!filesSnapshot || hasActiveMembership === null) return;

	// 	const files = filesSnapshot.docs;
	// 	const usersLimit = hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;

	// 	console.log(
	// 		"Checking if user is over file limit",
	// 		files.length,
	// 		usersLimit
	// 	);

	// 	setIsOverFileLimit(files.length >= usersLimit);
	// }, [filesSnapshot, hasActiveMembership, PRO_LIMIT, FREE_LIMIT]);

	useEffect(() => {
		const fetchUserData = async () => {
			if (!user) {
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				const token = Cookies.get("token");
				const { data } = await AXIOS.get(`/api/user`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`, // Include the token in the Authorization header
					},
				});

				console.log("membership user data---------", data);

				setHasActiveMembership(data.userData.activeMembership);
			} catch (err: any) {
				console.error("Error fetching user data:", err);
				setError(err);
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [user]);

	useEffect(() => {
		const fetchFilesData = async () => {
			if (!user || hasActiveMembership === null) {
				setFilesLoading(false);
				return;
			}

			try {
				setFilesLoading(true);

				const token = Cookies.get("token");
				const { data } = await AXIOS.get(`/api/files`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`, // Include the token in the Authorization header
					},
				});

				console.log("FREE_LIMIT_fetchFilesData_____", FREE_LIMIT);
				console.log("PRO_LIMIT_fetchFilesData_____", PRO_LIMIT);

				const usersLimit = hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;

				console.log("Files data:", data);

				console.log(
					"Checking if user is over file limit",
					data.files.length,
					usersLimit
				);
				setIsOverFileLimit(data.files.length >= usersLimit);
			} catch (err: any) {
				console.error("Error fetching files data:", err);
				setError(err);
			} finally {
				setFilesLoading(false);
				// setLoading(false);
			}
		};

		fetchFilesData();
	}, [user, hasActiveMembership]);

	console.log("isOverFileLimit111", isOverFileLimit);

	return { hasActiveMembership, loading, error, isOverFileLimit, filesLoading };
}

export default useSubscription;
