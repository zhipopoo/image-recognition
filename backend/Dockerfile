# FROM node:20-alpine3.17 as builder

# COPY /frontend/package.json .

# COPY /frontend/yarn.lock .

# RUN yarn install

# RUN yarn build

FROM python:3.10.12-slim-bookworm

ENV MONGO_ATLAS_CONNECTION mongodb+srv://asl123:abcd!234@cluster0.bjeuuat.mongodb.net/?retryWrites=true&w=majority

WORKDIR /backend

COPY . .

RUN pip install -r requirements.txt

RUN pip install gunicorn

# COPY COPY --from=builder /build dist/

EXPOSE 80

CMD gunicorn -w 1 -b 0.0.0.0:80 app:app