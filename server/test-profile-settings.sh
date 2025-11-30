#!/bin/bash

# ZOQIRA Profile & Settings Module - Test Suite
# This script tests all endpoints of the new Profile & Settings module
# Usage: bash test-profile-settings.sh <YOUR_ACCESS_TOKEN>

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:5000/api"

# Get token from argument
TOKEN=$1

if [ -z "$TOKEN" ]; then
    echo -e "${RED}Error: Access token required${NC}"
    echo "Usage: bash test-profile-settings.sh <YOUR_ACCESS_TOKEN>"
    exit 1
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   ZOQIRA Profile & Settings Module - Test Suite${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Helper function to make API requests
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${YELLOW}Test $TOTAL_TESTS: $description${NC}"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    echo "Status: $status_code"
    echo "Response: $body" | head -c 200
    echo -e "\n"
    
    if [[ $status_code =~ ^[2].. ]]; then
        echo -e "${GREEN}✓ PASSED${NC}\n"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ FAILED${NC}\n"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Test public endpoint (no auth)
test_public_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${YELLOW}Test $TOTAL_TESTS: $description${NC}"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    echo "Status: $status_code"
    echo "Response: $body" | head -c 200
    echo -e "\n"
    
    if [[ $status_code =~ ^[2].. ]]; then
        echo -e "${GREEN}✓ PASSED${NC}\n"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ FAILED${NC}\n"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   1. SETTINGS ENDPOINTS${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Test 1: Get Settings
test_endpoint "GET" "/settings/me" "" "GET /settings/me - Retrieve user settings"

# Test 2: Update Settings
test_endpoint "PATCH" "/settings/me" '{
  "theme": "dark",
  "language": "es",
  "preferences": {
    "aptitudeLevel": "advanced"
  }
}' "PATCH /settings/me - Update theme and language"

# Test 3: Update Privacy Settings
test_endpoint "PATCH" "/settings/privacy" '{
  "privacy": {
    "whoCanMessage": "friends",
    "readReceipts": false,
    "showOnlineStatus": false
  }
}' "PATCH /settings/privacy - Update privacy settings"

# Test 4: Update Notifications
test_endpoint "PATCH" "/settings/notifications" '{
  "notifications": {
    "messages": true,
    "calls": false,
    "groups": true,
    "friendRequests": false
  }
}' "PATCH /settings/notifications - Update notification preferences"

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   2. PROFILE ENDPOINTS${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Test 5: Get Public Profile (no auth needed)
test_public_endpoint "GET" "/profile/testuser" "" "GET /profile/:username - Get public profile"

# Test 6: Update Profile
test_endpoint "PATCH" "/profile/me" '{
  "name": "Test User",
  "bio": "A passionate developer",
  "location": "San Francisco, CA",
  "gender": "male"
}' "PATCH /profile/me - Update profile information"

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   3. VALIDATION TESTS${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Test 7: Invalid Theme Value
test_endpoint "PATCH" "/settings/me" '{
  "theme": "invalid_theme"
}' "PATCH /settings/me with invalid theme (should fail)"

# Test 8: Invalid Language
test_endpoint "PATCH" "/settings/me" '{
  "language": "invalid_lang"
}' "PATCH /settings/me with invalid language (should fail)"

# Test 9: Invalid Privacy Setting
test_endpoint "PATCH" "/settings/privacy" '{
  "privacy": {
    "whoCanMessage": "invalid"
  }
}' "PATCH /settings/privacy with invalid whoCanMessage (should fail)"

# Test 10: Invalid Notification Type
test_endpoint "PATCH" "/settings/notifications" '{
  "notifications": {
    "messages": "not_boolean"
  }
}' "PATCH /settings/notifications with non-boolean value (should fail)"

# Test 11: Name Too Short
test_endpoint "PATCH" "/profile/me" '{
  "name": "A"
}' "PATCH /profile/me with name too short (should fail)"

# Test 12: Bio Too Long
test_endpoint "PATCH" "/profile/me" '{
  "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
}' "PATCH /profile/me with bio exceeding 500 chars (should fail)"

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   TEST SUMMARY${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please review the output above.${NC}"
    exit 1
fi
