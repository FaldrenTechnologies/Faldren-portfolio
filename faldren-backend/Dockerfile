FROM maven:3.9.11-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests

RUN JAR_FILE=$(find target -maxdepth 1 -type f -name "*.jar" ! -name "*.original" | head -n 1) \
    && cp "$JAR_FILE" /app/app.jar


FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/app.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]