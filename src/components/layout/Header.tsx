import type { ReactNode } from "react";
// import Search from "../common/Search";

// Placeholder user avatar
const userAvatarUrl = "/profile.jpg";

interface HeaderProps {
  children?: ReactNode;
  className?: string;
  searchBar?: ReactNode;
}

const Header = ({ children, searchBar, className }: HeaderProps) => {
  // const handleSearch = (value: string) => {
  //   // Handle search change logic here
  //   alert(`Searching for: ${value}`);
  // };

  return (
    <div className={`${className}`}>
      <header className="bg-white shadow-sm p-4 mb-8 pb-10 flex justify-between items-center">
        {/* <Search onSearch={handleSearch} /> */}

        {children}

        {/* Right side: User avatar */}

        <div className="flex items-center space-x-4">
          {searchBar && <div className="flex-1">{searchBar}</div>}

          {/* User Avatar */}
          <div className="flex items-center space-x-2">
            <img
              src={userAvatarUrl}
              alt="User Avatar"
              className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
              onError={(e) =>
                (e.currentTarget.src = `https://placehold.co/50x50/4A90E2/FFFFFF?text=AD`)
              }
            />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
