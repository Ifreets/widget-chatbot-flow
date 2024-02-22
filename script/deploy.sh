#!/bin/bash

echo "--------------------------------------------------"
echo "--- Test Build Production ---"
echo "--------------------------------------------------"
# build thử xem có lỗi không
pnpm run build

echo ""
echo ""

echo "--------------------------------------------------"
echo "--- [1] Enter git commit message ---"
echo "--------------------------------------------------"
# Nhận thông điệp từ người dùng
read -p "Enter git commit message: " commit_message

# Kiểm tra xem có thông điệp hay không
if [ -z "$commit_message" ]; then
    echo "Not found commit message."
    exit 1
fi

echo ""
echo ""

echo "--------------------------------------------------"
echo "--- [2] Commit code ---"
echo "--------------------------------------------------"
# lấy code mới nhất về
git pull

# tăng phiên bản trong package.json
npm --no-git-tag-version version patch

# đẩy code lên github
git add .
git commit -m "$commit_message"
git push

echo ""
echo ""

# lấy phiên bản hiện tại
version=$(grep -o '"version": "[^"]*' package.json | awk -F'"' '{print $4}')

echo "============ $version ============"
echo "--- 🔥 Deploy success new version : $version ! 🔥 ---"
