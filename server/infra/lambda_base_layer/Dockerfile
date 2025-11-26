# Use Amazon Linux 2 base image
FROM amazonlinux:2

# Install build dependencies required for compiling Python 3.12 (since it’s not in default repos)  
RUN yum update -y && \
    yum groupinstall -y "Development Tools" && \
    yum install -y \
      wget \
      gcc \
      openssl11-devel \
      bzip2-devel \
      libffi-devel \
      zlib-devel \
      make \
      && yum clean all

# Download and compile Python 3.12
RUN cd /usr/src && \
    wget https://www.python.org/ftp/python/3.12.0/Python-3.12.0.tgz && \
    tar xzf Python-3.12.0.tgz && \
    cd Python-3.12.0 && \
    ./configure --enable-optimizations --with-ensurepip=install && \
    make -j$(nproc) && \
    make altinstall && \
    cd / && \
    rm -rf /usr/src/Python-3.12.0* 

# Verify and set up python3.12 binary  
RUN /usr/local/bin/python3.12 --version

# Install pip for that Python version
RUN /usr/local/bin/python3.12 -m pip install --upgrade pip

# Create folder for Lambda layer and install requirements inside it
WORKDIR /opt/layer
COPY requirements.txt . 
RUN /usr/local/bin/python3.12 -m pip install -r requirements.txt -t python/

# Package the layer
RUN zip -r layer.zip python/

# Final entrypoint — container remains available for docker cp artifact
ENTRYPOINT ["/bin/bash", "-l"]
