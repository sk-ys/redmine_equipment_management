class EmbooksController < ApplicationController
  before_action :find_embook, except: [:index, :new, :create]

  def index
    respond_to do |format|
      format.html {render action: 'index', layout: !request.xhr? }
    end
  end

  def new
  end

  def create
    # do nithing
    render status: 200, json: { status: 200, message: "This action is a dummy."}
  end

  def show
  end

  def edit
  end

  def update
  end

  def destroy
  end

private
  def find_embook
  end
end
