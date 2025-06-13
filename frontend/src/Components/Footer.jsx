import React from "react";
import { Box, Typography, Stack, Link, IconButton } from "@mui/material";
import { FaFacebookF, FaYoutube, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <Box component="footer" bgcolor="background.paper" py={3}>
      <Box maxWidth="lg" mx="auto" px={2}>
        {/* Top Section */}
        <Box
          borderBottom={1}
          borderColor="grey.700"
          py={2}
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          {/* Social Media */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography fontWeight="600">Follow Us</Typography>
            <Link href="/" color="inherit" sx={{ "&:hover": { color: "primary.main" } }} aria-label="Facebook">
              <IconButton size="small" color="inherit">
                <FaFacebookF />
              </IconButton>
            </Link>
            <Link href="/" color="inherit" sx={{ "&:hover": { color: "text.primary" } }} aria-label="Twitter">
              <IconButton size="small" color="inherit">
                <FaTwitter />
              </IconButton>
            </Link>
            <Link href="/" color="inherit" sx={{ "&:hover": { color: "error.main" } }} aria-label="YouTube">
              <IconButton size="small" color="inherit">
                <FaYoutube />
              </IconButton>
            </Link>
          </Stack>

          {/* Mobile Apps */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            spacing={{ xs: 1, md: 3 }}
            textAlign={{ xs: "center", md: "left" }}
          >
            <Typography fontWeight="600" variant="body1">
              Book Tickets faster. Download our mobile Apps
            </Typography>
            <Stack direction="row" spacing={1}>
              <Link href="#" aria-label="Google Play Store">
                <Box
                  component="img"
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  height={32}
                />
              </Link>
              <Link href="#" aria-label="Apple App Store">
                <Box
                  component="img"
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                  height={32}
                />
              </Link>
            </Stack>
          </Stack>

          {/* Payment Partners */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              component="img"
              src="https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-original-577x577/s3/092018/untitled-1_1.png?C3N3SkdbNYvT._tJW.AAychWVLWXqKNu&itok=vCjMCVZr"
              alt="Verified by Visa"
              height={40}
              sx={{ objectFit: "contain" }}
            />
            <Box
              component="img"
              src="https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-original-577x577/s3/042018/untitled-1_149.png?MTxYAoe2ktpxYfadLz_wLXxxa_v3wpmG&itok=B31jpnJd"
              alt="AmEx"
              height={40}
              sx={{ objectFit: "contain" }}
            />
            <Box
              component="img"
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
              alt="MasterCard"
              height={40}
              sx={{ objectFit: "contain" }}
            />
            <Box
              component="img"
              src="https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-original-577x577/s3/102014/rupay_0.png?itok=c6ADP1TM"
              alt="RuPay"
              height={40}
              sx={{ objectFit: "contain" }}
            />
            <Box
              component="img"
              src="https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-original-577x577/s3/0000/5552/brand.gif?itok=RrucB5sE"
              alt="IATA"
              height={40}
              sx={{ objectFit: "contain" }}
            />
          </Stack>
        </Box>

        {/* Bottom Section */}
        <Box
          mt={3}
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          textAlign={{ xs: "center", md: "left" }}
        >
          <Box
            component="img"
            src="/images/Logo.png"
            alt="Logo"
            height={40}
            sx={{ filter: "grayscale(1)", transition: "filter 0.3s ease-in-out", cursor: "pointer",
              "&:hover": { filter: "grayscale(0)" } }}
          />
          <Typography variant="caption" color="text.secondary">
            © 2025 Make A Trip (India) Private Limited. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
