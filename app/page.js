import { basePath } from "@/next.config";
import AuthButton from "./api/auth/AuthButton.server";

import { auth } from "@/api/auth";

export default async function Home() {
	const session = await auth();
	return (
		<>
			<html>
				<body>
					<div className="container">
						<div className="flex justify-center items-center h-full text-defaultsize text-defaulttextcolor">
							<div className="grid grid-cols-12">
              					  <AuthButton />
							</div>
						</div>
         			 </div>
				</body>
			</html>
		</>
	);
}
