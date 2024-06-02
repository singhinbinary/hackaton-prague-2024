import React, { useEffect, useState } from 'react';

type ProfileData = { name: string; address: string; image: string };

type Props = {
  data?: ProfileData[];
};

const ProfilesList: React.FC<Props> = ({ data }) => {
  const [universalProfiles, setProfiles] = useState<ProfileData[]>([
    {
      name: 'b00ste9',
      address: '0x0000002a62b213fcbe7c46835536f10bc69dce3c',
      image: 'QmNnXV3GGrXWmNoLcYrkpijkspNbSmKbygPrrdLDQRnxKf',
    },
    {
      name: 'kate',
      address: '0x000491fb71126921aa041c846fd78df38d50f7b2',
      image: 'QmQK5oRApcNNrjFxnYqcFfGDYzsQadvW6JbZJvKg6M9Dct',
    },
    {
      name: 'Universal Page',
      address: '0x00311Eea40Ef2687dC1049E5b6261481126fB9f3',
      image: 'bafkreibp2agat3cclnenhkmsdi5hszjymzff3hag5xw2qerh7j7k2yroau',
    },
  ]);

  useEffect(() => {
    if (!universalProfiles) {
      return;
    }
    // setProfiles(data);
  }, []);

  return (
    <ul className="divide-y divide-gray-200">
      {universalProfiles &&
        universalProfiles.map((profile) => (
          <li key={profile.address} className="py-4 flex">
            <img
              className="h-10 w-10 rounded-full"
              src={`https://api.universalprofile.cloud/ipfs/${profile.image}`}
              alt=""
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {profile.name}
              </p>
              <p className="text-sm text-gray-500">
                address: <code>{profile.address}</code>
              </p>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default ProfilesList;
