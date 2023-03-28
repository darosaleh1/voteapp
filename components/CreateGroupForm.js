import { useState } from "react";
import { ethers } from "ethers";

const CreateGroupForm = ({ createGroup }) => {
  const [groupName, setGroupName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const salt = ethers.utils.randomBytes(32);
    const hashedPassword = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["string", "bytes32"],
        [password, salt]
      )
    );

    await createGroup(groupName, isPrivate, hashedPassword, salt);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Group Name:
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />
      </label>
      <label>
        Private:
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => {
            setIsPrivate(e.target.checked);
            if (!e.target.checked) {
              setPassword("public");
            } else {
              setPassword("");
            }
          }}
        />
      </label>
      {isPrivate && (
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      )}
      <button type="submit">Create Group</button>
    </form>
  );
};

export default CreateGroupForm;



    