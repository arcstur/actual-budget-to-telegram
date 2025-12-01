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
      npmDepsHash = "sha256-T+HMETP8RNmanTee4k0fVdRdRHgTY7zE2irzmtj996U=";

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
