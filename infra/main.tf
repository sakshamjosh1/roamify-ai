provider "aws" {
  region = "ap-south-1" # Mumbai (change if needed)
}

resource "aws_instance" "roamify_ec2" {
  ami           = "ami-0f5ee92e2d63afc18" # Amazon Linux 2 (Mumbai)
  instance_type = "t2.micro"

  key_name = "roamify-key" # we will create this

  vpc_security_group_ids = [aws_security_group.roamify_sg.id]

  tags = {
    Name = "roamify-ai-ec2"
  }
}

resource "aws_security_group" "roamify_sg" {
  name        = "roamify-security-group"
  description = "Allow SSH and App Port"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "App Port"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}