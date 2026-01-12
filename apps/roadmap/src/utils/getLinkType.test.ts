// @vitest-environment node

import { describe, expect, it } from "vitest";
import getLinkTitle from "./getLinkType";

describe("getLinkTitle - Canvas Community Links", () => {
  it("returns 'changelog' for changelog links", () => {
    expect(
      getLinkTitle({
        linkUrl: "https://community.canvaslms.com/t5/ChangeLog/ct-p/changelog",
        title: "Some title",
      }),
    ).toBe("changelog");
  });

  it("returns 'timeline' for timeline links", () => {
    expect(
      getLinkTitle({
        linkUrl: "https://community.canvaslms.com/t5/Timeline/ct-p/timeline",
        title: "Timeline",
      }),
    ).toBe("timeline");
  });

  it("returns 'faq' for faq links", () => {
    expect(
      getLinkTitle({
        linkUrl: "https://community.canvaslms.com/t5/faq/ct-p/faq",
        title: "FAQ",
      }),
    ).toBe("faq");
  });

  it("returns 'product blog' for product blog links", () => {
    expect(
      getLinkTitle({
        linkUrl: "https://community.canvaslms.com/t5/the-product-blog/bg-p/the-product-blog",
        title: "Blog",
      }),
    ).toBe("product blog");
  });

  it("returns 'guides' for guide links", () => {
    expect(
      getLinkTitle({
        linkUrl: "https://community.canvaslms.com/t5/guide/ct-p/guide",
        title: "Guide",
      }),
    ).toBe("guides");
  });

  it("returns 'community' for community.canvaslms.com host", () => {
    expect(
      getLinkTitle({
        linkUrl: "https://community.canvaslms.com/some/path",
        title: "Community",
      }),
    ).toBe("community");
  });
});

describe("getLinkTitle - Video Links", () => {
  it("returns 'video' for video file extensions", () => {
    expect(
      getLinkTitle({
        linkUrl: "https://example.com/video.mp4",
        title: "Video",
      }),
    ).toBe("video");
    expect(
      getLinkTitle({
        linkUrl: "https://example.com/movie.MOV",
        title: "Video",
      }),
    ).toBe("video");
  });

  it("returns 'video' for known video hosts", () => {
    expect(
      getLinkTitle({
        linkUrl: "https://youtube.com/watch?v=abc",
        title: "Video",
      }),
    ).toBe("video");
    expect(
      getLinkTitle({
        linkUrl: "https://vimeo.com/12345",
        title: "Video",
      }),
    ).toBe("video");
    expect(
      getLinkTitle({
        linkUrl: "https://instructuremedia.com/abc",
        title: "Video",
      }),
    ).toBe("video");
    expect(
      getLinkTitle({
        linkUrl: "https://youtu.be/xyz",
        title: "Video",
      }),
    ).toBe("video");
  });

  it("handles uppercase URLs and hosts for video", () => {
    expect(
      getLinkTitle({
        linkUrl: "HTTPS://YOUTUBE.COM/WATCH?V=ABC",
        title: "Video",
      }),
    ).toBe("video");
  });
});

describe("getLinkTitle - Image Links", () => {
  it("returns 'image' for image file extensions", () => {
    expect(
      getLinkTitle({
        linkUrl: "https://example.com/picture.jpeg",
        title: "Image",
      }),
    ).toBe("image");
    expect(
      getLinkTitle({
        linkUrl: "https://example.com/picture.PNG",
        title: "Image",
      }),
    ).toBe("image");
    expect(
      getLinkTitle({
        linkUrl: "https://example.com/picture.svg",
        title: "Image",
      }),
    ).toBe("image");
  });

  it("handles uppercase URLs and hosts for image", () => {
    expect(
      getLinkTitle({
        linkUrl: "HTTPS://EXAMPLE.COM/PICTURE.JPG",
        title: "Image",
      }),
    ).toBe("image");
  });
});

describe("getLinkTitle - Other Links", () => {
  it("returns original title for unknown types", () => {
    expect(
      getLinkTitle({
        linkUrl: "https://example.com/other",
        title: "Unknown",
      }),
    ).toBe("Unknown");
  });

  it("returns original title for invalid URLs", () => {
    expect(
      getLinkTitle({
        linkUrl: "not-a-valid-url",
        title: "Invalid",
      }),
    ).toBe("Invalid");
  });

  it("returns original title if title is empty", () => {
    expect(
      getLinkTitle({
        linkUrl: "https://example.com/other",
        title: "",
      }),
    ).toBe("");
  });
});
