
import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div>
      {/* Add other sidebar content here */}
      <Link href="/create-group">
        <button>Create Group</button>
      </Link>
      <Link href="/my-groups">
  <button>My Groups</button>
</Link>
    </div>
  );
};

export default Sidebar;

