output "ec2_public_ip" {
    value = aws_instance.roamify_ec2.public_ip
}