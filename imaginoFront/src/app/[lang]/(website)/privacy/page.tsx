import Container from '@/components/shared/Container/Container';
import Section from '@/components/shared/Section/Section';
import React from 'react';

export default function Privacy() {
  return (
    <>
      <Container>
        <Section className="py-12">
          <div>
            <h1>Privacy Policy</h1>
            <br />
            <span>How Imagino collects and uses data</span>
            <br />
            <br />
            <p>
              This Privacy Policy explains how Imagino collects, uses, processes, discloses, and
              safeguards information we obtain from and about our customers, visitors to our Sites,
              and business prospects and partners (collectively, “You”), including information we
              collect when you visit our websites or other services offered by Imagino, or purchase
              our products and services (collectively, our “Services”).
              <br />
              Your use of the Services is subject to this Privacy Policy and to our Terms of
              Service, which can be viewed at https://Imagino.com/terms.
            </p>
          </div>
        </Section>
        <hr />
        <Section className="py-12">
          <h2>How Imagino collects information</h2>
          <p className="mb-5">
            For the purpose of this Privacy Policy, “Personal Information” means any information
            relating to an identified or identifiable individual. We obtain Personal Information
            relating to you, our business partner, from various sources described below. Where
            applicable, we indicate whether and why you must provide us with Personal Information,
            as well as the consequences of failing to do so. If you do not provide Personal
            Information when requested, you may not be able to benefit from our Services if that
            information is necessary to provide you with the service or if we are legally required
            to collect it.
          </p>

          <h3 className="mb-3">Personal Information provided by you.</h3>
          <p>Registration and other information you provide</p>
        </Section>
      </Container>
    </>
  );
}
