

const Profile = () => {
    return (
        <>
            <section className="text-white w-[400px] bg-black border border-[#38383b] px-4 rounded-lg my-8">
                <header className="headerProfile flex justify-between py-3">
                    <p className="font-bold">Profile</p>
                    <i className="fa-solid fa-angle-left"></i>
                </header>
                <div className="mb-5">
                    <form action="" className="text-[#bdbcbc] text-[14px]">
                        <div className="mb-4">
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" placeholder="User@example.com" className="w-full p-2 rounded-lg bg-[#27272a] " />
                        </div>
                        <div className="mb-4">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" placeholder="User123" className="w-full p-2 rounded-lg bg-[#27272a]  " />
                        </div>
                        <div className="mb-4">
                        <label htmlFor="FirstName">First Name</label>
                        <input type="text" id="FirstName" placeholder="John" className="w-full p-2 rounded-lg bg-[#27272a] " />
                        </div>
                        <div className="mb-4">
                        <label htmlFor="LastName">Last Name</label>
                        <input type="text" id="LastName" placeholder="Doe" className="w-full p-2 rounded-lg bg-[#27272a] " />
                        </div>
                    </form>
                    <div className="">
                    <button className="edit w-full py-2 my-2 bg-[#27272a] text-sm rounded-lg">Edit Profile</button>
                    <button className="reset w-full py-2 my-2 bg-[#c5b8f9] text-sm text-black rounded-lg">Reset Password</button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Profile;
