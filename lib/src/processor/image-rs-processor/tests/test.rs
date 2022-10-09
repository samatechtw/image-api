use std::fs;
use image_rs_processor::{convert, resize};

#[test]
fn test_convert() {
    let file_buffer = fs::read("assets/wtm_256x256.jpeg").unwrap();
    let out_buffer = convert(&file_buffer, "png");

    fs::write("test_out/wtm_256x256_jpeg.png", &out_buffer);
    assert!(file_buffer.len() < out_buffer.len())
}

#[test]
fn test_resize() {
    let file_buffer = fs::read("assets/wtm_256x256.jpeg").unwrap();
    let out_buffer = resize(&file_buffer, 128, 128);

    fs::write("test_out/wtm_256x256_to_128x128.jpeg", &out_buffer);
    assert!(file_buffer.len() > out_buffer.len())
}