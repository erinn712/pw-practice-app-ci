# 此image由playwright提供，playwright版本必須與安裝的版本吻合
FROM mcr.microsoft.com/playwright:v1.44.1-jammy

# 創建資料夾
RUN mkdir /app
# 切換到這個目錄，此目錄會是以後的工作目錄
WORKDIR /app
# [COPY 來源 目標資料夾]從主機複製所有文件
COPY . /app

# 安裝所有依賴
RUN npm install --force
RUN npx playwright install