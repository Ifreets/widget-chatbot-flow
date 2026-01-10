/**quản lý các đường dẫn của media */
export interface ICdn {
  /**
   * đường dẫn ảnh đại diện của page facebook
   * @param page_id id của trang
   */
  fbPageAvt(page_id?: string): string;
  /**
   * đường dẫn ảnh đại diện của page instagram
   * @param page_id id của trang
   */
  igPageAvt(page_id?: string): string;
  /**
   * đường dẫn ảnh đại diện của client facebook
   * @param page_id id của trang
   * @param client_id id của client
   */
  fbClientAvt(page_id?: string, client_id?: string): string;
  /**
   * đường dẫn ảnh đại diện của client instagram
   * @param page_id id của trang
   * @param client_id id của client
   */
  igClientAvt(page_id?: string, client_id?: string): string;
  /**
   * đường dẫn ảnh đại diện của client tiktok
   * @param page_id id của trang
   * @param client_id id của client
   */
  tiktokClientAvt(page_id?: string, client_id?: string): string;
}

/**
 * quản lý các đường dẫn của media
 */
export class Cdn implements ICdn {
  /**Host media cdn */
  private readonly HOST: string;

  constructor(host?: string) {
    this.HOST =
      host ||
      import.meta.env.VITE_MEDIA_CDN ||
      "https://chatbox-static-v3.botbanhang.vn";
  }

  fbPageAvt(page_id?: string) {
    return `${this.HOST}/media/fb/${page_id}/page`;
  }

  igPageAvt(page_id?: string) {
    return `${this.HOST}/media/ig/${page_id}/page`;
  }

  fbClientAvt(page_id?: string, client_id?: string) {
    return `${this.HOST}/media/fb/${page_id}/client/${client_id}`;
  }

  igClientAvt(page_id?: string, client_id?: string) {
    return `${this.HOST}/media/ig/${page_id}/client/${client_id}`;
  }

  tiktokClientAvt(page_id?: string, client_id?: string) {
    return `${this.HOST}/media/tiktok/${page_id}/client/${client_id}`;
  }
}

/**Singleton instance của CDN */
let cdnInstance: ICdn | null = null;

/**lấy instance của CDN */
export function getCdnInstance(): ICdn {
  if (!cdnInstance) {
    cdnInstance = new Cdn();
  }
  return cdnInstance;
}
