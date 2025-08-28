{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    pkgs = nixpkgs.legacyPackages."x86_64-linux";
  in {
    packages."x86_64-linux".default = pkgs.buildNpmPackage {
      pname = "actual-budget-to-telegram";
      version = "0.0.1";
      src = ./.;
      npmDepsHash = "sha256-EDV5njUHX16bvTXC2eMsRJK3M6lycAyIn9W1SvvQdo4=";

      meta = with pkgs.lib; {
        mainProgram = "actual-budget-to-telegram";
        description = "Telegram bot that sends reports and updates from Actual Budget";
        homepage = "https://github.com/arcstur/actual-budget-to-telegram";
        license = licenses.gpl3Only;
        platforms = platforms.linux;
      };
    };
  };
}
