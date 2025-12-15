import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  name?: string;
  otp: string;
}

export const VerificationEmail = ({
  name = "User",
  otp,
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address with the OTP code</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header Section */}
          <Section style={headerSection}>
            <Heading style={h1}>HazriPro</Heading>
            <Text style={headerSubtext}>Email Verification</Text>
            <Hr style={headerDivider} />
          </Section>

          {/* Main Content Section */}
          <Section style={contentSection}>
            <Text style={greeting}>
              Hello {name},
            </Text>
            
            <Text style={introText}>
              Thank you for creating a HazriPro account. To complete your registration, please verify your email address using the verification code below.
            </Text>

            {/* OTP Display Card */}
            <Section style={otpCard}>
              <Text style={otpLabel}>Verification Code</Text>
              <Row style={otpContainer}>
                {otp.split("").map((digit, index) => (
                  <Column key={index} style={otpDigitBox}>
                    <Text style={otpDigit}>{digit}</Text>
                  </Column>
                ))}
              </Row>
            </Section>

            <Text style={instructionText}>
              Enter this code on the verification screen to complete your registration.
            </Text>

            {/* Info Box */}
            <Section style={infoBox}>
              <Text style={infoText}>
                This code will expire in 24 hours. If you didn't create this account, you can safely ignore this email.
              </Text>
            </Section>
          </Section>

          {/* Divider */}
          <Hr style={divider} />

          {/* Footer Section */}
          <Section style={footerSection}>
            <Text style={footerText}>
              This email was sent by HazriPro. If you have any questions, please{" "}
              <Link href="mailto:support@hazripro.com" style={footerLink}>
                contact our support team
              </Link>
              .
            </Text>
            <Text style={copyright}>
              © {new Date().getFullYear()} HazriPro. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#1b2838",
  fontFamily:
    '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
  padding: "20px 0",
};

const container = {
  backgroundColor: "#16202d",
  margin: "0 auto",
  borderRadius: "0",
  maxWidth: "600px",
  overflow: "hidden",
  border: "1px solid #1e3a5f",
};

const headerSection = {
  background: "linear-gradient(180deg, #1b2838 0%, #16202d 100%)",
  padding: "32px 32px 20px",
  textAlign: "center" as const,
};

const headerDivider = {
  borderColor: "#66c0f4",
  borderWidth: "2px 0 0 0",
  margin: "20px 0 0 0",
};

const h1 = {
  color: "#66c0f4",
  fontSize: "32px",
  fontWeight: "700",
  lineHeight: "40px",
  margin: "0 0 8px",
  textAlign: "center" as const,
  letterSpacing: "1px",
  textTransform: "uppercase" as const,
};

const headerSubtext = {
  color: "#c7d5e0",
  fontSize: "14px",
  fontWeight: "400",
  margin: "0",
  textAlign: "center" as const,
  letterSpacing: "0.5px",
};

const contentSection = {
  padding: "32px",
  backgroundColor: "#16202d",
};

const greeting = {
  color: "#c7d5e0",
  fontSize: "18px",
  fontWeight: "400",
  lineHeight: "26px",
  margin: "0 0 20px",
};

const introText = {
  color: "#8f98a0",
  fontSize: "15px",
  lineHeight: "22px",
  margin: "0 0 32px",
};

const otpCard = {
  backgroundColor: "#1b2838",
  borderRadius: "4px",
  padding: "28px 24px",
  margin: "0 0 28px",
  border: "1px solid #1e3a5f",
  borderTop: "2px solid #66c0f4",
};

const otpLabel = {
  color: "#66c0f4",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 20px",
  textAlign: "center" as const,
};

const otpContainer = {
  margin: "0 auto",
  textAlign: "center" as const,
  width: "100%",
};

const otpDigitBox = {
  backgroundColor: "#0e1621",
  borderRadius: "4px",
  width: "52px",
  height: "60px",
  textAlign: "center" as const,
  verticalAlign: "middle",
  border: "1px solid #1e3a5f",
  padding: "0 6px",
};

const otpDigit = {
  color: "#66c0f4",
  fontSize: "28px",
  fontWeight: "700",
  fontFamily: "monospace",
  margin: "0",
  lineHeight: "60px",
  textAlign: "center" as const,
  display: "block",
};

const instructionText = {
  color: "#8f98a0",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const infoBox = {
  backgroundColor: "#1b2838",
  borderRadius: "4px",
  padding: "16px 20px",
  margin: "0 0 24px",
  border: "1px solid #1e3a5f",
  borderLeft: "3px solid #66c0f4",
};

const infoText = {
  color: "#8f98a0",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0",
  fontWeight: "400",
};

const footerText = {
  color: "#6d7882",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 12px",
  textAlign: "center" as const,
};

const divider = {
  borderColor: "#1e3a5f",
  borderWidth: "1px 0 0 0",
  margin: "0",
};

const footerSection = {
  padding: "24px 32px",
  backgroundColor: "#0e1621",
};

const footerLink = {
  color: "#66c0f4",
  textDecoration: "underline",
};

const copyright = {
  color: "#4c5863",
  fontSize: "11px",
  lineHeight: "16px",
  margin: "12px 0 0 0",
  textAlign: "center" as const,
};

