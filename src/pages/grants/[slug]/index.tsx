import axios from 'axios';
import type { GetServerSideProps } from 'next';
import { usePostHog } from 'posthog-js/react';
import React, { useEffect, useState } from 'react';

import { GrantsPop } from '@/features/conversion-popups/components/GrantsPop';
import { type GrantWithApplicationCount } from '@/features/grants/types';
import { DescriptionUI } from '@/features/listings/components/ListingPage/DescriptionUI';
import { GrantPageLayout } from '@/layouts/Grants';
import { getURL } from '@/utils/validUrl';

interface InitialGrant {
  grant: GrantWithApplicationCount;
}

function Grants({ grant: initialGrant }: InitialGrant) {
  const [grant] = useState<typeof initialGrant>(initialGrant);

  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture('open_grant');
  }, []);

  return (
    <GrantPageLayout grant={grant}>
      <GrantsPop />
      <DescriptionUI description={(grant?.description as string) ?? ''} />
    </GrantPageLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;

  let grantData;
  try {
    const grantDetails = await axios.get(`${getURL()}api/grants/${slug}`);
    grantData = grantDetails.data;
  } catch (e) {
    console.error(e);
    grantData = null;
  }

  return {
    props: {
      grant: grantData,
    },
  };
};
export default Grants;
